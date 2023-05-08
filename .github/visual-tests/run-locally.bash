#!/usr/bin/env bash

#export DOMAIN_MAIN="main--vg-macktrucks-com--hlxsites.hlx.page"
#export DOMAIN_BRANCH="update-from-boilerplate--vg-macktrucks-com--hlxsites.hlx.page"

export DOMAIN_MAIN="main--vg-volvotrucks-us--hlxsites.hlx.live"
export DOMAIN_BRANCH="426-service-contracts--vg-volvotrucks-us--hlxsites.hlx.live"

export TEST_PATHS="/ /trucks/vnl/ /find-a-dealer/ /trucks/vnl/interior/ /block-library/blocks/bullet-points"

# we ignore the exit code of the test command because we want to continue
npx playwright test
set -e

cat test-results/visual-diff.md
