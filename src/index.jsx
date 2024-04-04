import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import { Center, Image as CImage, Square, Circle, Box, Text, Flex, Spacer, AbsoluteCenter, HStack, Heading } from '@chakra-ui/react'
import { HookCard } from './hook_card.jsx';
import { theme, LogoBox } from "./styles.js"
import { ChakraProvider } from '@chakra-ui/react'
import { Swiper } from './swiper.jsx'


//const REST_API_URL = 'http://localhost:8000/api';
const REST_API_URL = "/api";

function slugify(slug) {
    //replace non-alphanumeric characters with hyphens and lowercase
    return slug.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}

async function preloadImages(imageUrls) {
    // stagger the image downloads a little
    const PRELOAD_PAUSE_MS = 100;
    for (let imageUrl of imageUrls) {
        if (imageUrl !== null && imageUrl !== undefined) {
            await new Promise((resolve) => {
                let img = new Image();
                img.src = imageUrl;
                setTimeout(() => resolve(imageUrl), PRELOAD_PAUSE_MS);
            });
        }
    }
}

async function getHooks(setImages) {
    let hooks = await fetch(`${REST_API_URL}/random_hooks/50`);
    hooks = await hooks.json();
    getImages(hooks.map(hook => hook.page_id)).then(images => {
        setImages((existingImages) => {
            return { ...existingImages, ...images };
        });
    });
    return hooks;
}

async function getHook(id, setImages) {
    let hook = await fetch(`${REST_API_URL}/hook/${id}`);
    hook = await hook.json();

    getImages([hook].map(hook => hook.page_id)).then(images => {
        setImages((existingImages) => {
            return { ...existingImages, ...images };
        });
    });

    return hook;
}

async function getImages(page_ids) {
    const response = await fetch(`${REST_API_URL}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(page_ids)
    });
    const images = await response.json();
    preloadImages(Object.values(images))
    return images;
}

function App() {
    const [hooks, setHooks] = useState([]);
    const [images, setImages] = useState({});

    async function getMoreHooks() {
        let moreHooks = await getHooks(setImages);
        setHooks((hooks) => {
            return [...hooks, ...moreHooks];
        });
    }

    useEffect(() => {

        // check location hash to see if we need to start at a specific hook
        if (window.location.pathname) {
            const hash = window.location.pathname.slice(1);
            const parsedHash = hash.split('/', 2);
            if (parsedHash.length === 2) {
                const id = parseInt(parsedHash[0]);
                getHook(id, setImages).then(hook => {
                    setHooks([hook]);
                    getMoreHooks();
                });
                // we've finished loading hooks
                return;
            }
        }
        getHooks(setImages).then(hooks => {
            setHooks(hooks,);
        });
    }, []);

    const page_ids = hooks.map(hook => hook.page_id);
    const slugs = hooks.map(hook => `${hook.id}/${slugify(hook.slug)}`);
    const cards = hooks.map(hook => <HookCard key={hook.id} title={hook.title} hook={hook.hook_text} />);

    return (
        <React.Fragment>
            <ChakraProvider theme={theme}>
                <LogoBox>
                    <CImage width="100%" src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" alt="Wikipedia logo" />
                </LogoBox>
                <Center bg='#eaecf0' h={['60px', '70px', '100px']} color='black' opacity="90%">
                    <Heading variant="title">Did you know...?</Heading>
                </Center>

                <Box display="flex" justifyContent="center" m={0} p={0}>
                    <Box position="relative" m={0} p={0}>
                        <Swiper fetchMore={getMoreHooks} slugs={slugs} children={cards} page_ids={page_ids} images={images} />
                    </Box>
                </Box>
            </ChakraProvider>
        </React.Fragment>
    );
}

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
