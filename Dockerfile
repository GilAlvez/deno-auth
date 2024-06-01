FROM denoland/deno:1.44.0

EXPOSE 3001

WORKDIR /app

ADD . .

RUN chmod +x /app/scripts/wait-for-it.sh
RUN chmod +x /app/scripts/entrypoint.sh

RUN deno cache src/main.ts

CMD ["/app/scripts/entrypoint.sh"]