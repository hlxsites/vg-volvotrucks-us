#!/usr/bin/env bash

export DOMAIN_MAIN="main--vg-volvotrucks-us--hlxsites.hlx.live"
export DOMAIN_BRANCH="426-service-contracts--vg-volvotrucks-us--hlxsites.hlx.live"

export TEST_PATHS="/ /trucks/vnl/ /find-a-dealer/ /trucks/vnl/interior/ /block-library/blocks/bullet-points"


# we ignore the exit code of the test command because we want to continue
npx playwright test | tee playwright.log

set -e

if grep -q "$DOMAIN_BRANCH" playwright.log; then
  echo "Diffs found"

  SUMMARY="### :small_orange_diamond: Visual differences detected
  $(grep "$DOMAIN_BRANCH" playwright.log)
  "
  echo "$SUMMARY"
else
  echo "No diffs found"
  echo "No diffs found" >> "$GITHUB_STEP_SUMMARY"
  echo "SUMMARY=" >> "$GITHUB_ENV"
fi
