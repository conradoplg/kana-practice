import re
import os
import sys

_WORD_RE = re.compile(r'^(\w+)(\|\d+)?(\(\w+\))?(\[\d+\])?(\{\w+\})?~?')
_KANA_RE = re.compile(r'^[\u30a0-\u30ff\u3040-\u309f]+$')


def is_kana(s):
    return _KANA_RE.match(s)


def get_word_kana(word):
    """
    Given a "word", return it as kana.

    Uses edict2.
    """
    # TODO: this is actually wrong. edict2 can have multiple words in one line; handle it.
    # Currently, this sees only the first word.
    regex = re.compile(r'^' + word + r'\W[^\[]*\[([^\](;]+)')
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
    if reading:
        word_kana = reading
    elif is_kana(word):
        word_kana = word
    else:
        word_kana = get_word_kana(word)
        if not word_kana:
            raise RuntimeError('get_word_kana({}) returned None'.format(repr(word)))
    if form:
        if is_kana(form):
            return form
        # Assuming form is kanjis + kana.
        # Find the kana for "kanjis"
        kana_suffix = os.path.commonprefix([word[::-1], word_kana[::-1]])[::-1]
        kanji_prefix = word[:len(word)-len(kana_suffix)]
        kanji_prefix_kana = word_kana[:len(word_kana)-len(kana_suffix)]
        if not form.startswith(kanji_prefix):
            raise RuntimeError('form does not start with the kanji prefix {}; full_word={}'.format(repr(kanji_prefix), repr(full_word)))
        word_kana = kanji_prefix_kana + form[len(kanji_prefix):]
    if not is_kana(word_kana):
        raise RuntimeError('convert_word failed to convert entirely to kana; full_word={}; word_kana={}'.format(repr(full_word), repr(word_kana)))
    return word_kana


def parse_jpn_indices_line(line):
    arr = line.strip().split(maxsplit=2)
    if len(arr) != 3:
        return
    sentence = arr[2]
    try:
        kana_sentence = ''.join(convert_word(word) for word in sentence.split())
        return kana_sentence, None
    except RuntimeError as e:
        import traceback
        tb = traceback.format_exc()
        error = '{}\n{}'.format(sentence, tb)
        return None, error


def main():
    with open('util/jpn_indices.csv', encoding='utf-8') as f:
        for line in f:
            kana_sentence, error = parse_jpn_indices_line(line)
            if kana_sentence:
                print(kana_sentence)
            else:
                print(error, file=sys.stderr)


if __name__ == '__main__':
    main()
