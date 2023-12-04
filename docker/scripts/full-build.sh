#COMMON
./cnly.sh -n 'kit,enums' 'npm run build:kit' 'npm run build:shared-enums'

#BACKEND common
./cnly.sh -n 'core-config' 'npm run build:backend:core-config'
./cnly.sh -n 'back-kit' 'npm run build:backend:back-kit'

#FRONTEND common
./cnly.sh -n 'front-kit,ui-kit' 'npm run build:frontend:front-kit' 'npm run build:frontend:ui-kit'

#MAIN
./cnly.sh -n 'backend,frontend,landing,email-templates' 'cd packages/back/backend && npm run build:prod' 'cd packages/front/frontend && npm run build' 'cd packages/front/landing && npm run build' 'cd packages/front/email-templates && npm run build'
