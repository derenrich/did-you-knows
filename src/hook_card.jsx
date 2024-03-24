import { Box, Box, Heading, Button } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { StarIcon, LinkIcon } from '@chakra-ui/icons'


export function HookCard({ hook, title }) {
    return (
        <>
            <Box position="relative" display="flex" flexDirection="column" justifyContent="space-between" p={8} m={8} borderRadius='10px' width='35em ' minH='80vh' overflow='hidden' bgGradient='linear(to-r, green.200, pink.500)' >
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
                    <Box marginLeft="auto" marginTop={"auto"} width="fit-content" >
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
