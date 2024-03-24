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


async function getHooks() {
    let hooks = await fetch('http://localhost:8000/api/random_hooks/10');
    return hooks.json();
}

function App() {

    const [hooks, setHooks] = useState([]);
    const [index, setIndex] = useState(0);

    function prevHook() {
        setIndex(index - 1);
    }


    function nextHook() {
        setIndex(index + 1);
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

                <Swiper children={hooks.map(hook => <HookCard hook={hook.hook_text} />)} />
            </ChakraProvider>
        </React.Fragment>
    );
}

const container = document.getElementById("app");
const root = createRoot(container)
root.render(<App />);
