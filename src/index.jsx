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


//const REST_API_URL = 'http://localhost:8000/api';
const REST_API_URL = "";

async function getHooks() {
    let hooks = await fetch(`${REST_API_URL}/random_hooks/10`);
    return hooks.json();
}

function App() {
    const [hooks, setHooks] = useState([]);

    async function getMoreHooks() {
        console.log("getting...");
        let moreHooks = await getHooks();
        setHooks([...hooks, ...moreHooks]);
    }

    useEffect(() => {
        getHooks().then(hooks => {
            setHooks(hooks);
        });
    }, []);

    return (
        <React.Fragment>
            <ChakraProvider theme={theme}>
                <LogoBox>
                    <Image width="100%" src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" alt="Wikipedia logo" />
                </LogoBox>
                <Center bg='#eaecf0' h='100px' color='black' opacity="90%">
                    <Heading variant="title">Did you know...?</Heading>
                </Center>

                <Box display="flex" justifyContent="center">
                    <Box position="relative">
                        <Swiper fetchMore={getMoreHooks} children={hooks.map(hook => <HookCard key={hook.id} title={hook.title} hook={hook.hook_text} />)} />
                    </Box>
                </Box>
            </ChakraProvider>
        </React.Fragment>
    );
}

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
