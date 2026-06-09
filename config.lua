Config = {}

-- Idioma de la interfaz: 'es' o 'en'.
Config.Language = 'es'

-- Debug solo imprime mensajes pequeños en cliente cuando está activo.
Config.Debug = false

-- Decor usado para sincronizar el estilo seleccionado con otros jugadores cercanos.
Config.DecorName = 'jx_gunstyle'

-- Comando y tecla para abrir el menú.
Config.Command = 's_anim'
Config.Keybind = 'F5'

-- Comportamiento del menú.
Config.CloseOnSelect = true
Config.SaveSelectedStyle = true

-- Personalización visual de la interfaz.
Config.Theme = {
    accent = '#a855f7',
    accentRgb = '168, 85, 247',
    accentSecond = '#7c3aed',
    accentSecondRgb = '124, 58, 237',
    success = '#22c55e',
    successRgb = '34, 197, 94',
}

-- Intervalos de los loops. Valores más altos = menor consumo.
Config.LocalAnimTick = 250
Config.IdleAnimTick = 750
Config.SyncTick = 2500

-- Estilos disponibles.
-- key: clave usada para traducir nombre/descripción en locales/*.lua.
-- override: weapon animation override de GTA/FiveM.
-- dict/anim: animación opcional para reforzar el estilo visual al apuntar.
-- image: imagen local dentro de html/.
Config.ShootingStyles = {
    {
        key = 'normal',
        override = 'Default',
        image = 'images/3.png',
    },
    {
        key = 'hillbilly',
        override = 'Hillbilly',
        dict = 'combat@aim_variations@1h@hillbilly',
        anim = 'aim_variation_a',
        image = 'images/2.png',
    },
    {
        key = 'gang',
        override = 'Gang1H',
        dict = 'combat@aim_variations@1h@gang',
        anim = 'aim_variation_a',
        image = 'images/1.png',
    },
}
