todaysDate ?= $(shell date -I | sed 's/2023-12-//')
date ?= $(todaysDate)

run-today:
	@bb -i $(date).clj < $(date).txt

test-today:
	@bb -i $(date).clj < $(date)-test.txt

paste-today-input:
	@pbpaste > $(date).txt

touch-today:
	@touch $(date).clj
	@touch $(date)-test.txt
	@touch $(date).txt
