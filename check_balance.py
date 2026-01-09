
content = open('/home/kaan/Masaüstü/tuplar-tool/scripts/tools/resume-builder.js').read()
stack = []
for i in range(len(content)):
    if content[i:i+2] == '${':
        stack.append(i)
    elif content[i] == '}':
        # This is tricky because } is also used for blocks.
        # But if we only care about } that close ${, we need to know if we are inside a template literal.
        pass

# Simple count check
open_interpolation = content.count('${')
print(f"Total ${{ : {open_interpolation}")

# Check backtick balance again
backticks = content.count('`')
print(f"Total backticks: {backticks}")
