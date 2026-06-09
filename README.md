# JX Shooting Styles

Fork optimizado de `bbv-shootingstyles` para FiveM. Mantiene la licencia MIT y el crédito original a BuddyBoyVilla.

## Qué hace

Permite cambiar el estilo de apuntado/disparo del jugador desde una interfaz NUI ligera.

Incluye:

- Standalone, sin ESX/QBCore obligatorio.
- Interfaz renovada y responsive.
- Imágenes sin recorte agresivo.
- Locales `es` y `en`.
- Configuración simple en `config.lua`.
- Guardado opcional del último estilo elegido.
- Exports y eventos client para radial menus u otros scripts.

## Instalación

1. Mete la carpeta `jx-shootingstyles` en tus resources.
2. Añade esto al `server.cfg`:

```cfg
ensure jx-shootingstyles
```

## Configuración básica

Edita `config.lua`:

```lua
Config.Language = 'es' -- es / en
Config.Command = 's_anim'
Config.Keybind = 'F5'
Config.CloseOnSelect = true
Config.SaveSelectedStyle = true
```

Los textos están en:

```txt
locales/es.lua
locales/en.lua
```

## Añadir estilos

En `config.lua` añade otro bloque dentro de `Config.ShootingStyles`:

```lua
{
    key = 'gang',
    override = 'Gang1H',
    dict = 'combat@aim_variations@1h@gang',
    anim = 'aim_variation_a',
    image = 'images/1.png',
},
```

Luego traduce el nombre y descripción en `locales/es.lua` y `locales/en.lua` usando la misma `key`.

## Uso

Comando por defecto:

```txt
/s_anim
```

Tecla por defecto:

```txt
F5
```

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

Fork basado en `bbv-shootingstyles`, publicado bajo licencia MIT por BuddyBoyVilla. Mantén el archivo `LICENSE` al distribuir el recurso.
