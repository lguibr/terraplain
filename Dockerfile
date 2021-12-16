FROM node:16-alpine

RUN npm install --global cdktf-cli
RUN npm install --global tsc

ENV NODE_VERSION=16.9.0
ENV DEFAULT_TERRAFORM_VERSION=1.0.11

# Install Terraform
RUN apk add curl zip docker-cli unzip && AVAILABLE_TERRAFORM_VERSIONS="0.12.29 ${DEFAULT_TERRAFORM_VERSION}" && \
  for VERSION in ${AVAILABLE_TERRAFORM_VERSIONS}; do curl -LOk https://releases.hashicorp.com/terraform/${VERSION}/terraform_${VERSION}_linux_amd64.zip && \
  mkdir -p /usr/local/bin/tf/versions/${VERSION} && \
  unzip terraform_${VERSION}_linux_amd64.zip -d /usr/local/bin/tf/versions/${VERSION} && \
  ln -s /usr/local/bin/tf/versions/${VERSION}/terraform /usr/local/bin/terraform${VERSION};rm terraform_${VERSION}_linux_amd64.zip;done && \
  ln -s /usr/local/bin/tf/versions/${DEFAULT_TERRAFORM_VERSION}/terraform /usr/local/bin/terraform

WORKDIR /

CMD ["sh"]