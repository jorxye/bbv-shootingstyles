fx_version 'cerulean'
game 'gta5'

name 'jx-shootingstyles'
author 'JX Store / Fork from BuddyBoyVilla bbv-shootingstyles'
description 'Standalone shooting styles menu with optimized NUI, locales and configurable styles.'
version '1.1.1-fork'
license 'MIT'

lua54 'yes'

client_scripts {
    'config.lua',
    'locales/*.lua',
    'client/main.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/app.js',
    'html/style.css',
    'html/images/*.png'
}
