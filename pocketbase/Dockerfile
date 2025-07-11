FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /pb

COPY pocketbase ./pocketbase
COPY pb_migrations ./pb_migrations

RUN chmod +x ./pocketbase && mkdir -p ./pb_data

EXPOSE 8090
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8090"]
