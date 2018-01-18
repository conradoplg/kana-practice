import re

_WORD_RE = re.compile(r'^(\w+)(\|\d+)?(\(\w+\))?(\[\d+\])?(\{\w+\})?~?')
_KANA_RE = re.compile(r'^[\u30a0-\u30ff\u3040-\u309f]+$')


def is_kana(s):
    return _KANA_RE.match(s)


def get_word_kana(word):
    """
    Given a "word", return it as kana.

    Uses edict2.
    """
    regex = re.compile(r'^' + word + r'\W[^\[]+\[([^\]]+)\]')
    with open('util/edict2', encoding='utf-8') as f:
        for line in f:
            m = regex.match(line)
            if m:
                return m.group(1)
    return None


def parse_full_word(full_word):
    """
    Parse a Tanaka corpus line B "full word" (e.g. "此れ[01]{これ}").
    """
    m = _WORD_RE.match(full_word)
    if not m:
        raise RuntimeError('Unable to match: ' + full_word)
    word, _, reading, sense, form = m.groups()
    if reading:
        reading = reading[1:-1]
    if sense:
        sense = sense[1:-1]
    if form:
        form = form[1:-1]
    return word, reading, sense, form


def convert_word(full_word):
    word, reading, sense, form = parse_full_word(full_word)
    if form and is_kana(form):
        return form


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
    assert get_word_kana('此れ') == 'これ'
    assert parse_full_word('物(もの)[01]{もの}') == ('物', 'もの', '01', 'もの')
    assert is_kana('ぁぬゖァヴ')
    assert not is_kana('abc')
    assert not is_kana('ぁabc')
    assert not is_kana('abcぁ')
    assert convert_word('住む{住んでいる}') == 'すんでいる'