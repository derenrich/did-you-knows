#!/bin/bash
# run on toolforge as "did-you-knows"
ssh toolforge

become did-you-knows

# build the image
toolforge build start https://github.com/derenrich/did-you-knows.git

# run the image
toolforge webservice --backend=kubernetes --mount=none buildservice start
