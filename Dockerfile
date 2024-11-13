FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN --mount=type=secret,id=auth0_domain,env=VITE_AUTH0_DOMAIN,required \
    --mount=type=secret,id=auth0_client_id,env=VITE_AUTH0_CLIENT_ID,required \

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
