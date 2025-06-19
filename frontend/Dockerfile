FROM node:22-alpine
COPY ./dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "-l", "3000", "dist"]