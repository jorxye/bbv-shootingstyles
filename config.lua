Config = {}

-- Debug only prints small client messages when enabled.
Config.Debug = false

-- Decor name used to sync the selected style to nearby players.
-- Change it only if another resource already uses the same decorator.
Config.DecorName = 'jx_gunstyle'

-- Command and keybind used to open the shooting styles menu.
-- Players can change the keybind later from FiveM keybind settings.
Config.Command = 's_anim'
Config.Keybind = 'F5'
Config.KeybindDescription = 'Abrir estilos de disparo'

-- Menu behaviour.
Config.CloseOnSelect = true
Config.SaveSelectedStyle = true

-- Loop intervals. Higher values reduce usage while keeping the script responsive.
Config.LocalAnimTick = 250
Config.IdleAnimTick = 750
Config.SyncTick = 2500

-- UI text.
Config.Locale = {
    title = 'Estilos de disparo',
    subtitle = 'Selecciona cómo apunta y dispara tu personaje.',
    reset = 'Restablecer',
    close = 'Cerrar',
    selected = 'Aplicado',
}

-- Available styles.
-- override: weapon animation override name used by GTA/FiveM.
-- dict/anim: optional upper-body aiming animation for stronger visual style.
-- image: optional local NUI image shown in the menu.
Config.ShootingStyles = {
    {
        label = 'Normal',
        description = 'Vuelve al estilo de disparo por defecto.',
        override = 'Default',
        image = 'images/3.png',
    },
    {
        label = 'Hillbilly',
        description = 'Postura de apuntado más agresiva y descontrolada.',
        override = 'Hillbilly',
        dict = 'combat@aim_variations@1h@hillbilly',
        anim = 'aim_variation_a',
        image = 'images/2.png',
    },
    {
        label = 'Gang',
        description = 'Estilo urbano a una mano.',
        override = 'Gang1H',
        dict = 'combat@aim_variations@1h@gang',
        anim = 'aim_variation_a',
        image = 'images/1.png',
    },
}
