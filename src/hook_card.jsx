import { Center, Square, Circle, Box, Container, Heading } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { StarIcon, LinkIcon } from '@chakra-ui/icons'


export function HookCard({ hook }) {
    return (
        <>
            <Container position="absolute" left="calc(50% - 15em)" p={8} m={8} centerContent borderRadius='10px' width="100%" minW='30em ' minH='80vh' overflow='hidden' bgGradient='linear(to-r, green.200, pink.500)' >
                <Heading pt={'2em'}>
                    {hook}
                </Heading>
                <Box position="absolute" bottom={'3em'} left={0} right={0} p={4} textAlign="center" >
                    <Box display="flex" justifyContent="flex-end" >
                        <Box p='1em' m='1em' borderRadius='10px' bgColor='rgb(128, 128, 128, 0.7)'>
                            <IconButton icon={<StarIcon />} colorScheme="green" aria-label="Like" mr={2} />
                            <IconButton icon={<LinkIcon />} colorScheme="blue" aria-label="Share" />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
