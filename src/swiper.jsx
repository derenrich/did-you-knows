import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Center, Image, Square, Circle, Box, Text, Flex, Spacer, AbsoluteCenter, HStack, Heading } from '@chakra-ui/react'
import { Show, Hide } from '@chakra-ui/react'

const variants = {


    enter: (direction) => {
        return {
            x: direction > 0 ? 300 : -300,
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            position: "absolute"
        };
    }
};

const imageVariants = {
    enter: {
        filter: "blur(10px)",
        opacity: 0
    },
    center: {
        filter: "blur(0px)",
        opacity: 1
    },
    exit: {
        filter: "blur(10px)",
        opacity: 0
    }
};

function randomAngle() {
    return Math.floor(Math.random() * 20) - 10;
}

const swipeConfidenceThreshold = 8000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export function Swiper({ children, fetchMore, slugs, page_ids, images }) {
    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection) => {
        setPage((pageState) => {
            const page = pageState[0];
            if (page + newDirection > 0 && page + newDirection < children.length) {
                return [pageState[0] + newDirection, newDirection];
            } else {
                return pageState;
            }
        });
    };

    if (page === children.length - 1) {
        fetchMore();
    }

    if (slugs.length > 0) {
        window.location.replace('#' + slugs[page]);
    }
    const handleKey = (evt) => {
        if (evt.key === 'ArrowRight') {
            paginate(1);
        } else if (evt.key === 'ArrowLeft') {
            paginate(-1);
        }
    }
    // scroll with arrow keys
    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, [page, children]);

    return (
        <>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    mode="wait"
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 400, damping: 13 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.3}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                >
                    <div position="absolute" className="card-clickable-region" onClick={() => paginate(1)}>
                    </div>
                    {children[page]}
                </motion.div>

                <Show breakpoint="(orientation: landscape)"
                >
                    <motion.div
                        variants={imageVariants}
                        key={images[page_ids[page]]}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            opacity: { duration: 0.2 }
                        }}
                        style={{
                            position: "absolute",
                            left: "0px",
                            top: "0px"
                        }}
                    >
                        {images[page_ids[page]] ?
                            <Box filter="drop-shadow(5px 5px 5px)" display={["none", "none", "block"]}
                                key={images[page_ids[page]]} position="absolute" top="10em" left="calc(35em + 10vh)"
                                width="400px" transform={`rotate(${randomAngle()}deg)`}><Image src={images[page_ids[page]]} alt="random" width="400px" /> </Box>
                            : null}
                    </motion.div>
                </Show>
            </AnimatePresence>
        </>
    );
};
