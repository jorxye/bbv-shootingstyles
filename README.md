# JX Shooting Styles

Fork optimizado de `bbv-shootingstyles` para FiveM. Mantiene licencia MIT y crédito original.

## Incluye

- Standalone, sin framework obligatorio.
- Interfaz NUI estética, responsive y configurable.
- Locales `es` y `en`.
- Imágenes visibles completas, sin recorte agresivo.
- Guardado opcional del último estilo.
- Exports y eventos client para integrarlo en menús/radiales.

## Instalación

1. Mete `jx-shootingstyles` en `resources`.
2. Añade en `server.cfg`:

```cfg
ensure jx-shootingstyles
```

## Config básico

```lua
Config.Language = 'es' -- es / en
Config.Command = 's_anim'
Config.Keybind = 'F5'
Config.CloseOnSelect = true
Config.SaveSelectedStyle = true
```

Los textos están en `locales/es.lua` y `locales/en.lua`.

## Tema visual

Puedes cambiar colores en `config.lua`:

```lua
Config.Theme = {
    accent = '#a855f7',
    accentRgb = '168, 85, 247',
    success = '#22c55e',
    successRgb = '34, 197, 94',
}
```

## Añadir estilos

Añade un bloque en `Config.ShootingStyles` y traduce la misma `key` en los locales.

```lua
{
    key = 'gang',
    override = 'Gang1H',
    dict = 'combat@aim_variations@1h@gang',
    anim = 'aim_variation_a',
    image = 'images/1.png',
},
```

## Uso

```txt
/s_anim
```

Tecla por defecto: `F5`.

## Exports client

```lua
exports['jx-shootingstyles']:OpenMenu()
exports['jx-shootingstyles']:CloseMenu()
exports['jx-shootingstyles']:SetStyle(2)
local currentStyle = exports['jx-shootingstyles']:GetCurrentStyle()
```

## Eventos client

```lua
TriggerEvent('jx-shootingstyles:client:open')
TriggerEvent('jx-shootingstyles:client:close')
TriggerEvent('jx-shootingstyles:client:setStyle', 2)
```

## Licencia

Fork basado en `bbv-shootingstyles`, publicado bajo licencia MIT por BuddyBoyVilla. Mantén `LICENSE` al distribuir el recurso.
