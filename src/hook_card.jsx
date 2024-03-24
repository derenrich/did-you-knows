import { Box, Box, Heading } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { StarIcon, LinkIcon } from '@chakra-ui/icons'


export function HookCard({ hook }) {
    return (
        <>
            <Box position="relative" display="flex" flexDirection="column" justifyContent="space-between" p={8} m={8} borderRadius='10px' width='35em ' minH='80vh' overflow='hidden' bgGradient='linear(to-r, green.200, pink.500)' >
                <Heading pt={'2em'}>
                    {hook}
                </Heading>

                <Box marginLeft="auto" marginTop={"auto"} width="fit-content" >
                    <Box p='1em' m='1em' borderRadius='10px' bgColor='rgb(128, 128, 128, 0.7)'>
                        <IconButton icon={<StarIcon />} colorScheme="green" aria-label="Like" mr={2} />
                        <IconButton icon={<LinkIcon />} colorScheme="blue" aria-label="Share" />
                    </Box>
                </Box>

            </Box>
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
