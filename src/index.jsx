import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import { Center, Image, Square, Circle, Box, Text, Flex, Spacer, AbsoluteCenter, HStack, Heading } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import { HookCard } from './hook_card.jsx';
import { theme, LogoBox } from "./styles.js"
import { ChakraProvider } from '@chakra-ui/react'
import { Swiper } from './swiper.jsx'


function slugify(slug) {
    //replace non-alphanumeric characters with hyphens and lowercase
    return slug.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}

//const REST_API_URL = 'http://localhost:8000/api';
const REST_API_URL = "/api";

async function getHooks() {
    let hooks = await fetch(`${REST_API_URL}/random_hooks/10`);
    return hooks.json();
}

async function getHook(id) {
    let hook = await fetch(`${REST_API_URL}/hook/${id}`);
    return hook.json();
}

function App() {
    const [hooks, setHooks] = useState([]);

    async function getMoreHooks() {
        console.log("getting...");
        let moreHooks = await getHooks();
        setHooks([...hooks, ...moreHooks]);
    }

    useEffect(() => {

        // check location hash to see if we need to start at a specific hook
        if (window.location.hash) {
            const hash = window.location.hash.slice(1);
            const parsedHash = hash.split('/', 2);
            if (parsedHash.length === 2) {
                const id = parseInt(parsedHash[0]);
                getHook(id).then(hook => {
                    setHooks([hook]);
                    getMoreHooks();
                });

            }
        } else {
            getHooks().then(hooks => {
                setHooks(hooks);
            });
        }
    }, []);

    const slugs = hooks.map(hook => `${hook.id}/${slugify(hook.slug)}`);
    const cards = hooks.map(hook => <HookCard key={hook.id} title={hook.title} hook={hook.hook_text} />);

    return (
        <React.Fragment>
            <ChakraProvider theme={theme}>
                <LogoBox>
                    <Image width="100%" src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" alt="Wikipedia logo" />
                </LogoBox>
                <Center bg='#eaecf0' h={['60px', '70px', '100px']} color='black' opacity="90%">
                    <Heading variant="title">Did you know...?</Heading>
                </Center>

                <Box display="flex" justifyContent="center" m={0} p={0}>
                    <Box position="relative" m={0} p={0}>
                        <Swiper fetchMore={getMoreHooks} slugs={slugs} children={cards} />
                    </Box>
                </Box>
            </ChakraProvider>
        </React.Fragment>
    );
}

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
