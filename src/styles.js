
import { defineStyleConfig } from '@chakra-ui/react'
import { Box, extendTheme, useStyleConfig } from "@chakra-ui/react"


const Heading = defineStyleConfig({
    variants: {
        title: {
            fontFamily: "Linux Libertine",
            fontSize: "4em",
            color: "gray.800"
        }
    }
});

const LogoBoxStyle = defineStyleConfig({
    baseStyle: {
        position: "absolute",
        left: "25%",
        zIndex: "-1",
        top: "5%",
        width: "400px"
    }
});

export const theme = extendTheme({
    colors: {
        wikimedia: {
            500: "#eaecf0"
        }

    },
    components: {
        Heading,
        LogoBox: LogoBoxStyle
    }
});

export function LogoBox(props) {
    const { variant, ...rest } = props

    const styles = useStyleConfig('LogoBox', { variant })

    // Pass the computed styles into the `__css` prop
    return <Box __css={styles} {...rest} />
}