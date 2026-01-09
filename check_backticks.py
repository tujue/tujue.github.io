
content = open('/home/kaan/Masaüstü/tuplar-tool/scripts/tools/resume-builder.js').read()
backticks = []
for i, char in enumerate(content):
    if char == '`':
        backticks.append(i)

print(f"Total backticks: {len(backticks)}")
if len(backticks) % 2 != 0:
    print("BACKTICK IMBALANCE DETECTED!")
    # Find context of the last few backticks
    for b in backticks[-5:]:
        start = max(0, b - 50)
        end = min(len(content), b + 50)
        print(f"Index {b}: ...{content[start:end]}...")
else:
    print("Backticks are balanced.")
