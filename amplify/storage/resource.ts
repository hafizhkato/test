import { defineStorage } from '@aws-amplify/backend';


export const storage = defineStorage({
  name: 'UserStorages',
  access: (allow) => ({
    'image-documents/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],

}),
});