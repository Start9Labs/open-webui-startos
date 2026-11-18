ARCHES := x86 arm
# overrides to s9pk.mk must precede the include statement
include node_modules/@start9labs/start-sdk/s9pk.mk

SECURITY_PLATFORM ?= linux/amd64
SECURITY_IMAGE := open-webui-runtime-security:$(subst /,-,$(SECURITY_PLATFORM))

.PHONY: test-security
test-security:
	docker buildx build --load --platform $(SECURITY_PLATFORM) -t $(SECURITY_IMAGE) .
	docker run --rm --platform $(SECURITY_PLATFORM) -v "$(CURDIR)/tests:/tests:ro" --entrypoint sh $(SECURITY_IMAGE) -ec \
		'/usr/local/bin/python -m playwright install --with-deps chromium; /usr/local/bin/python /tests/runtime_security.py $(SECURITY_TEST_ARGS)'
