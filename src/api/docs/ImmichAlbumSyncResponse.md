# ImmichAlbumSyncResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**albumId** | **string** |  | [default to undefined]
**albumName** | **string** |  | [default to undefined]
**albumUrl** | **string** |  | [default to undefined]
**source** | [**ImmichAlbumSource**](ImmichAlbumSource.md) |  | [default to undefined]
**created** | **boolean** |  | [default to undefined]
**assetsFound** | **number** |  | [default to undefined]
**assetsAdded** | **number** |  | [default to undefined]
**totalAlbumAssets** | **number** |  | [default to undefined]
**assets** | [**Array&lt;ImmichAssetPreviewResponse&gt;**](ImmichAssetPreviewResponse.md) |  | [default to undefined]

## Example

```typescript
import { ImmichAlbumSyncResponse } from './api';

const instance: ImmichAlbumSyncResponse = {
    id,
    albumId,
    albumName,
    albumUrl,
    source,
    created,
    assetsFound,
    assetsAdded,
    totalAlbumAssets,
    assets,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
