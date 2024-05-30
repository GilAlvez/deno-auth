FROM denoland/deno:1.44.0

EXPOSE 3001

WORKDIR /app

ADD . .

RUN deno cache src/main.ts

CMD  ["deno", "serve", "--port", "3001" ,"src/main.ts" ]