import { Box, Box, Heading, Button } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { StarIcon, LinkIcon } from '@chakra-ui/icons'


function randomBackgroundGradient() {
    // random angle
    const angle = Math.floor(Math.random() * 360);
    // random color 1
    const r1 = Math.floor(Math.random() * 256);
    const g1 = Math.floor(Math.random() * 256);
    const b1 = Math.floor(Math.random() * 256);

    // random color 2
    const r2 = Math.floor(Math.random() * 256);
    const g2 = Math.floor(Math.random() * 256);
    const b2 = Math.floor(Math.random() * 256);

    return `linear-gradient(${angle}deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
}

export function HookCard({ hook, title }) {
    // linear(to-r, green.200, pink.500)
    return (
        <>
            <Box position="relative" display="flex" flexDirection="column" justifyContent="space-between" p={8} m={8} borderRadius='10px' width='35em ' minH='80vh' overflow='hidden' bgGradient={randomBackgroundGradient()} >
                <Heading pt={'2em'}>
                    {hook}
                </Heading>
                <Box display="flex" flexDirection="row" justifyContent="space-between" >
                    <Button p='1em' m='1em' width="10em" bgColor='wikimedia.500' opacity={0.8} borderRadius='10px'>
                        <a display="block" href={"https://en.wikipedia.org/wiki/" + title}>
                            Learn more about <br />
                            <strong>{title}</strong>
                        </a>
                    </Button>
                    <Box marginLeft="auto" marginTop={"auto"} width="fit-content">
                        <Box p='1em' m='1em' borderRadius='10px' bgColor='wikimedia.500' opacity={0.8}>
                            <IconButton icon={<StarIcon />} colorScheme="green" aria-label="Like" mr={2} />
                            <IconButton icon={<LinkIcon />} colorScheme="blue" aria-label="Share" />
                        </Box>
                    </Box>
                </Box>
            </Box >
        </>
    );
}


export function HookCard2({ hook }) {
    return (
        <>
            <Box bgGradient='linear(to-r, green.200, pink.500)' >
                {hook}

            </Box>
        </>
    );
}
