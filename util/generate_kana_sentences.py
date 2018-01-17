import re

_WORD_RE = re.compile(r'^(\w+)(\|\d+)?(\[\d+\])?(\{\w+\})?~?')

def get_word_kana(word):
    regex = re.compile(r'^' + word + r'\W[^\[]+\[([^\]]+)\]')
    with open('util/edict2', encoding='utf-8') as f:
        for line in f:
            m = regex.match(line)
            if m:
                return m.group(1)
    return None

def parse_full_word(full_word):
    m = _WORD_RE.match(full_word)
    if not m:
        raise RuntimeError('Unable to match: ' + full_word)
    word, _, sense, reading = m.groups()
    if sense:
        sense = sense[1:-1]
    if reading:
        reading = reading[1:-1]
    return word, sense, reading


def convert_word(full_word):
    word, sense, reading = parse_full_word(full_word)


def parse_jpn_indices_line(line):
    arr = line.strip().split(maxsplit=2)
    if len(arr) != 3:
        return
    sentence = arr[2]
    print(sentence)
    for word in sentence.split():
        convert_word(word)


def main():
    i = 0
    with open('util/jpn_indices.csv', encoding='utf-8') as f:
        for line in f:
            parse_jpn_indices_line(line)
            i += 1
            if i == 10:
                break


if __name__ == '__main__':
    # main()
    print(get_word_kana('此れ'))
