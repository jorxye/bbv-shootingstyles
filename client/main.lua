local RESOURCE_NAME = GetCurrentResourceName()
local DECOR_NAME = Config.DecorName or 'jx_gunstyle'
local KVP_KEY = ('%s:selected_style'):format(RESOURCE_NAME)

local State = {
    menuOpen = false,
    currentStyle = 1,
    loadedAnimDicts = {},
    lastPed = 0,
}

local function getLocale()
    local lang = Config.Language or 'es'
    return (Locales and Locales[lang]) or (Locales and Locales.es) or (Locales and Locales.en) or {}
end

local function getNested(tbl, ...)
    local current = tbl

    for i = 1, select('#', ...) do
        local key = select(i, ...)
        if type(current) ~= 'table' then
            return nil
        end

        current = current[key]
    end

    return current
end

local function translate(...)
    return getNested(getLocale(), ...)
end

local function debugPrint(...)
    if Config.Debug then
        print(('[%s]'):format(RESOURCE_NAME), ...)
    end
end

local function getStyle(index)
    index = tonumber(index)

    if not index or not Config.ShootingStyles[index] then
        return nil, nil
    end

    return Config.ShootingStyles[index], index
end

local function normalizeOverrideName(style)
    return style and style.override or 'Default'
end

local function stopStyleAnim(ped, style)
    if style and style.dict and style.anim and IsEntityPlayingAnim(ped, style.dict, style.anim, 3) then
        StopAnimTask(ped, style.dict, style.anim, 1.0)
    end
end

local function requestAnimDict(dict)
    if not dict or State.loadedAnimDicts[dict] then
        return true
    end

    RequestAnimDict(dict)

    local timeout = GetGameTimer() + 3000
    while not HasAnimDictLoaded(dict) do
        Wait(25)

        if GetGameTimer() > timeout then
            debugPrint(('Anim dict timeout: %s'):format(dict))
            return false
        end
    end

    State.loadedAnimDicts[dict] = true
    return true
end

local function getCurrentWeapon(ped)
    local ok, weaponHash = GetCurrentPedWeapon(ped, true)

    if type(ok) == 'number' and weaponHash == nil then
        return true, ok
    end

    return ok == true, weaponHash
end

local function getAmmoInClipSafe(ped, weaponHash)
    if not weaponHash then
        return 0
    end

    local ok, ammo = GetAmmoInClip(ped, weaponHash)

    if type(ok) == 'number' and ammo == nil then
        return ok
    end

    if ok == true then
        return ammo or 0
    end

    return 0
end

local function setPedStyle(ped, styleIndex)
    local style, index = getStyle(styleIndex)

    if not style then
        return false
    end

    SetWeaponAnimationOverride(ped, GetHashKey(normalizeOverrideName(style)))

    if ped == PlayerPedId() then
        State.currentStyle = index
        DecorSetInt(ped, DECOR_NAME, index)

        if Config.SaveSelectedStyle then
            SetResourceKvpInt(KVP_KEY, index)
        end
    end

    return true
end

local function applyPlayerStyle(styleIndex)
    local ped = PlayerPedId()
    local previousStyle = Config.ShootingStyles[State.currentStyle]

    stopStyleAnim(ped, previousStyle)

    return setPedStyle(ped, styleIndex)
end

local function buildUiPayload()
    local styles = {}
    local locale = getLocale()
    local uiLocale = locale.ui or {}
    local fallbackStyle = uiLocale.style_fallback or 'Style'

    for index, style in ipairs(Config.ShootingStyles) do
        local styleLocale = translate('styles', style.key or tostring(index)) or {}

        styles[#styles + 1] = {
            id = index,
            label = styleLocale.label or style.label or ('%s %s'):format(fallbackStyle, index),
            description = styleLocale.description or style.description or '',
            image = style.image or '',
        }
    end

    return {
        action = 'openMenu',
        lang = Config.Language or 'es',
        locale = uiLocale,
        theme = Config.Theme or {},
        styles = styles,
        selected = State.currentStyle,
    }
end

local function forceCloseMenu()
    State.menuOpen = false
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({ action = 'forceClose' })
end

local function closeMenu()
    forceCloseMenu()
end

local function openMenu()
    forceCloseMenu()
    Wait(0)

    State.menuOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage(buildUiPayload())
end

RegisterCommand(Config.Command, function()
    if State.menuOpen then
        closeMenu()
    else
        openMenu()
    end
end, false)

RegisterKeyMapping(Config.Command, translate('keybind', 'open_menu') or 'Open shooting styles', 'keyboard', Config.Keybind)

exports('OpenMenu', openMenu)
exports('CloseMenu', closeMenu)
exports('SetStyle', applyPlayerStyle)
exports('GetCurrentStyle', function()
    return State.currentStyle
end)

RegisterNetEvent('jx-shootingstyles:client:open', openMenu)
RegisterNetEvent('jx-shootingstyles:client:close', closeMenu)
RegisterNetEvent('jx-shootingstyles:client:setStyle', function(styleIndex)
    applyPlayerStyle(styleIndex)
end)

RegisterNUICallback('exit', function(_, cb)
    forceCloseMenu()
    cb({ ok = true })
end)

RegisterNUICallback('changestyle', function(data, cb)
    local styleIndex = tonumber(data and data.style)

    if not styleIndex or not Config.ShootingStyles[styleIndex] then
        cb({ ok = false, error = 'invalid_style' })
        return
    end

    local applied = applyPlayerStyle(styleIndex)

    if Config.CloseOnSelect then
        forceCloseMenu()
    else
        SendNUIMessage({ action = 'setSelected', selected = State.currentStyle })
    end

    cb({ ok = applied, selected = State.currentStyle })
end)

AddEventHandler('onResourceStop', function(resource)
    if resource ~= RESOURCE_NAME then
        return
    end

    forceCloseMenu()
    stopStyleAnim(PlayerPedId(), Config.ShootingStyles[State.currentStyle])
end)

CreateThread(function()
    forceCloseMenu()
    Wait(250)
    forceCloseMenu()
    Wait(750)
    forceCloseMenu()

    while not NetworkIsSessionStarted() do
        Wait(500)
    end

    DecorRegister(DECOR_NAME, 3)

    local savedStyle = Config.SaveSelectedStyle and GetResourceKvpInt(KVP_KEY) or 1
    if not Config.ShootingStyles[savedStyle] then
        savedStyle = 1
    end

    applyPlayerStyle(savedStyle)
end)

CreateThread(function()
    while true do
        local sleep = Config.IdleAnimTick or 750
        local ped = PlayerPedId()

        if ped ~= State.lastPed then
            State.lastPed = ped
            setPedStyle(ped, State.currentStyle)
        end

        local style = Config.ShootingStyles[State.currentStyle]

        if style and State.currentStyle > 1 and style.dict and style.anim and IsPedArmed(ped, 4) then
            sleep = Config.LocalAnimTick or 250

            if requestAnimDict(style.dict) then
                local hasWeapon, weaponHash = getCurrentWeapon(ped)
                local hasAmmo = hasWeapon and getAmmoInClipSafe(ped, weaponHash) > 0
                local shouldPlay = IsPlayerFreeAiming(PlayerId()) or (IsControlPressed(0, 24) and hasAmmo)

                if shouldPlay then
                    if not IsEntityPlayingAnim(ped, style.dict, style.anim, 3) then
                        TaskPlayAnim(ped, style.dict, style.anim, 8.0, -8.0, -1, 49, 0.0, false, false, false)
                    end
                else
                    stopStyleAnim(ped, style)
                end
            end
        elseif style then
            stopStyleAnim(ped, style)
        end

        Wait(sleep)
    end
end)

CreateThread(function()
    while true do
        for _, playerId in ipairs(GetActivePlayers()) do
            local ped = GetPlayerPed(playerId)

            if ped ~= 0 and DoesEntityExist(ped) and DecorExistOn(ped, DECOR_NAME) then
                local styleIndex = DecorGetInt(ped, DECOR_NAME)
                local style = Config.ShootingStyles[styleIndex]

                if style then
                    SetWeaponAnimationOverride(ped, GetHashKey(normalizeOverrideName(style)))
                end
            end
        end

        Wait(Config.SyncTick or 2500)
    end
end)
