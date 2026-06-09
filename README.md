# JX Shooting Styles

Fork mantenido y optimizado de **bbv-shootingstyles**. El recurso permite que el jugador cambie su estilo de apuntado/disparo mediante una interfaz NUI ligera, configurable y sin depender de ningún framework.

> Créditos originales: BuddyBoyVilla / bbv-shootingstyles.  
> Licencia: MIT. Se mantiene el archivo `LICENSE` original por compatibilidad legal del fork.

---

## Características

- Standalone: funciona con ESX, QBCore, Qbox o cualquier framework.
- Menú NUI renovado, responsive y sin dependencias externas.
- Sin jQuery, sin CDN, sin imágenes remotas y sin FontAwesome externo.
- Callback NUI dinámico mediante `GetParentResourceName()`: puedes renombrar la carpeta sin romper la interfaz.
- Configuración separada en `config.lua`.
- Estilos configurables con label, descripción, imagen, override, dict y animación opcional.
- Guarda el último estilo seleccionado con KVP del cliente.
- Sin prints innecesarios en consola salvo `Config.Debug = true`.
- Validación de estilos antes de aplicar cambios.
- Cierre seguro de NUI al parar el resource.
- Animaciones gestionadas con `StopAnimTask` en vez de limpiar todas las tareas del ped.
- Sin carga repetida de anim dicts.
- Exports y eventos client para integrarlo en radial menus u otros scripts.

---

## Instalación

1. Descarga o copia la carpeta `jx-shootingstyles` dentro de `resources/[standalone]/`.
2. Añade el recurso al `server.cfg`:

```cfg
ensure jx-shootingstyles
```

3. Reinicia el servidor o ejecuta:

```cfg
refresh
ensure jx-shootingstyles
```

---

## Uso

Por defecto:

- Comando: `/s_anim`
- Tecla: `F5`

La tecla se puede cambiar desde los ajustes de keybinds de FiveM por cada jugador.

---

## Configuración rápida

Todo lo importante está en `config.lua`.

```lua
Config.Command = 's_anim'
Config.Keybind = 'F5'
Config.CloseOnSelect = true
Config.SaveSelectedStyle = true
```

### Añadir un estilo nuevo

```lua
Config.ShootingStyles[#Config.ShootingStyles + 1] = {
    label = 'Nombre del estilo',
    description = 'Descripción corta para la interfaz.',
    override = 'Gang1H',
    dict = 'combat@aim_variations@1h@gang',
    anim = 'aim_variation_a',
    image = 'images/1.png',
}
```

Campos:

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `label` | Sí | Nombre visible en la interfaz. |
| `description` | No | Texto corto visible en la tarjeta. |
| `override` | Sí | Nombre del weapon animation override. |
| `dict` | No | Diccionario de animación para el aiming overlay. |
| `anim` | No | Animación dentro del diccionario. |
| `image` | No | Imagen local dentro de `html/`. |

---

## Exports client

```lua
exports['jx-shootingstyles']:OpenMenu()
exports['jx-shootingstyles']:CloseMenu()
exports['jx-shootingstyles']:SetStyle(2)
local style = exports['jx-shootingstyles']:GetCurrentStyle()
```

## Eventos client

```lua
TriggerEvent('jx-shootingstyles:client:open')
TriggerEvent('jx-shootingstyles:client:close')
TriggerEvent('jx-shootingstyles:client:setStyle', 2)
```

---

## Integración con radial menu

Ejemplo genérico:

```lua
{
    id = 'shootingstyles',
    title = 'Estilos de disparo',
    icon = 'gun',
    type = 'client',
    event = 'jx-shootingstyles:client:open',
    shouldClose = true
}
```

---

## Optimización aplicada

Cambios principales respecto al original:

- Reestructuración de `main.lua` a `client/main.lua` + `config.lua`.
- Eliminado el hardcode `https://bbv-shootingstyles/...` en NUI.
- Eliminadas dependencias externas en la interfaz.
- Interfaz reconstruida con JavaScript vanilla.
- Renderizado dinámico de estilos desde Lua.
- Validación de callbacks NUI.
- Cache de anim dicts cargados.
- Uso de waits configurables.
- Decor configurable para sincronizar estilos en otros jugadores.
- Guardado opcional del estilo seleccionado.
- README completo para instalación, configuración e integraciones.

---

## Solución de problemas

### El menú no abre

Verifica que el recurso está iniciado:

```cfg
ensure jx-shootingstyles
```

Y prueba el comando:

```txt
/s_anim
```

### La tecla F5 no funciona

FiveM guarda los keybinds por jugador. Entra en ajustes de FiveM y busca `Abrir estilos de disparo` para cambiar o resetear la tecla.

### He renombrado la carpeta y antes fallaba

Este fork ya no usa el nombre del recurso hardcodeado en JavaScript. Mientras el recurso esté iniciado correctamente, los callbacks NUI funcionarán aunque cambies el nombre de la carpeta.

### Otro script usa el mismo Decor

Cambia este valor en `config.lua`:

```lua
Config.DecorName = 'jx_gunstyle'
```

---

## Licencia y atribución

Este fork deriva de `bbv-shootingstyles`, publicado bajo licencia MIT por BuddyBoyVilla. Puedes modificar, publicar y distribuir el recurso, siempre manteniendo el aviso de copyright/licencia incluido en `LICENSE`.
