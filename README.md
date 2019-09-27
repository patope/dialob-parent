# Dialog Composer Reference Application

Reference implementation of an application for Dialob Composer

## Configuration

```javascript
const DIALOB_COMPOSER_CONFIG = {
  transport: {
    csrf: {
      headerName: window.COMPOSER_CONFIG.csrfHeader,
      token: window.COMPOSER_CONFIG.csrf
    },
    apiUrl: window.COMPOSER_CONFIG.backend_api_url,
    previewUrl: window.COMPOSER_CONFIG.filling_app_url,
    tenantId: window.COMPOSER_CONFIG.tenantId,
  },
  itemEditors: DEFAULT_ITEM_CONFIG,
  itemTypes: DEFAULT_ITEMTYPE_CONFIG,
  postAddItem: (dispatch, action, lastItem) => {},
  closeHandler : () => {}
};
```

* **transport** - Transport configuration, CSRF header, token etc.
* **apiUrl** - URL for Dialob backend service API
* **previewUrl** - (Optional) URL for Dialob Filling preview application. If omitted, "Preview" feature is disabled.  `/<sessionId>` is appended to the URL for preview.
* **itemEditors** - Configuration for item editors
* **itemTypes** - Configuration for item types
* **closeHandler** - JS function that is called when toolbar `X` button is clicked.
* **postAddItem** - (Optional) callback function that gets called after a new item gets added to a form. Arguments: `dispatch` - Redux dispatch for dispatching additional actions into composer state, `action`- The Redux action that was used for creating the item, `lastItem` - The item that was added (including ID). Use this, for example, to create addtitional form structure depending on the created item, communicate to other parts of application etc.

### Item type configuration

### Item editor configuration

