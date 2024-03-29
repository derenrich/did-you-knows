import { Box, Box, Heading, Button, Image } from '@chakra-ui/react'
import { Random, MersenneTwister19937 } from "random-js";


function prettyTitle(title) {
    const MAX_TITLE_LENGTH = 40;
    const prettyTitle = title.replace(/_/g, " ");
    if (prettyTitle.length > MAX_TITLE_LENGTH) {
        return prettyTitle.substring(0, MAX_TITLE_LENGTH) + "...";
    } else {
        return prettyTitle;

    }
}

const hashCode = s => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)


function randomBackgroundGradient(hook) {
    const random = new Random(MersenneTwister19937.seed(hashCode(hook)));

    // random angle
    const angle = random.integer(0, 360);
    // random color 1
    const r1 = random.integer(80, 255);
    const g1 = random.integer(80, 255);
    const b1 = random.integer(80, 255);

    // random color 2
    const r2 = random.integer(80, 255);
    const g2 = random.integer(80, 255);
    const b2 = random.integer(80, 255);

    return `linear-gradient(${angle}deg, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`;
}

export function HookCard({ hook, title }) {
    let url = "https://en.wikipedia.org/wiki/" + title;
    return (
        <>
            <Box position="relative" display="flex" flexDirection="column" justifyContent="space-between" p={[1, 3, 8]} m={[0, 0, 8]} borderRadius='10px' width='35em ' minH='80vh' overflow='hidden' bgGradient={randomBackgroundGradient(hook)} >
                <Heading pt={'0.5em'} fontSize={["x-large", "xx-large", "xxx-large"]}>
                    {hook}
                </Heading>
                <Box display="flex" flexDirection="row" justifyContent="space-between" >
                    <Button onClick={() => { location.href = url; }} p='1em' m='1em' bgColor='wikimedia.500' opacity={0.8} borderRadius='10px'>
                        <Image position="relative" left="-2em" width="100%" src="https://upload.wikimedia.org/wikipedia/en/8/80/Wikipedia-logo-v2.svg" alt="Wikipedia logo" />

                        <a display="block" href={url}>
                            Learn more about <br />
                            <strong>{prettyTitle(title)}</strong>
                        </a>
                    </Button>
                    {/*
                    <Box marginLeft="auto" marginTop={"auto"} width="fit-content">
                        <Box p='1em' m='1em' borderRadius='10px' bgColor='wikimedia.500' opacity={0.8}>
                            <IconButton icon={<StarIcon />} colorScheme="green" aria-label="Like" mr={2} />
                            <IconButton icon={<LinkIcon />} colorScheme="blue" aria-label="Share" />
                        </Box>
                    </Box>
                    */}
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
