#!/usr/bin/env bash
pushd "$(dirname ${BASH_SOURCE[0]})"

rm -rf ../lib
mkdir -p ../lib
pushd ../kano-code/app
tar -cvf lib.tar \
    elements/kano-animated-svg elements/kano-app-player-toolbar \
    elements/kano-app-player elements/behaviors/kano-workspace-behavior.html \
    elements/behaviors/kano-app-element-registry-behavior.html \
    elements/kano-workspace-normal elements/kano-workspace-lightboard \
    elements/kano-workspace-camera elements/kano-bitmap-renderer \
    elements/part elements/ui elements/kano-gif-creator scripts/kano/make-apps/utils.html\
    scripts/kano/make-apps/parts-api scripts/kano/app-modules scripts/kano/make-apps/blockly/msg\
    scripts/kano/make-apps/parts scripts/kano/make-apps/mode scripts/kano/make-apps/msg \
    scripts/kano/make-apps/files scripts/kano/make-apps/hardware-api.html \
    scripts/kano/pixel-font.html scripts/kano/music \
    scripts/kano/microphone.html scripts/kano/make-apps/microphone-proxy.html \
    scripts/kano/make-apps/spring.html scripts/kano/webcam.js \
    scripts/kano/make-apps/text-to-speech.js

popd
mv ../kano-code/app/lib.tar ../lib
pushd ../lib
tar xvf lib.tar
rm lib.tar
grep -rli 'bower_components' * | xargs -I@ sed -i 's/bower_components/..\/../g' @
grep -rli "'/assets/" * | xargs -I@ sed -i "s/'\/assets\//'https:\/\/apps.kano.me\/assets\//g" @
grep -rli '"/assets/mode/lightboard/body.svg' * | xargs -I@ sed -i 's/"\/assets\//"https:\/\/apps.kano.me\/assets\//g' @
popd
mkdir -p ../lib/scripts/config
cp ./files/web.staging.html ./files/web.html ./files/staging.cnf.html ../lib/scripts/config