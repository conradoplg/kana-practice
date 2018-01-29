from generate_kana_sentences import *

def test_all():
    assert get_word_kana('此れ') == 'これ'
    assert get_word_kana('住む') == 'すむ'
    assert parse_full_word('物(もの)[01]{もの}') == ('物', 'もの', '01', 'もの')
    assert is_kana('ぁぬゖァヴ')
    assert not is_kana('abc')
    assert not is_kana('ぁabc')
    assert not is_kana('abcぁ')
    assert convert_word('住む{住んでいる}') == 'すんでいる'
    assert convert_word('為る(する){して}') == 'して'
    #私たち が 其処(そこ){そこ} へ 行く かどうか を 決める の は|1 君(きみ)[01]{君の} 責任 だ
    assert convert_word('私たち') == 'わたしたち'
    assert convert_word('君(きみ)[01]{君の}') == 'きみの'
    # Test for edict2 with two readings
    assert convert_word('馬鹿げる{馬鹿げていた}') == 'ばかげていた'
    assert get_romaji('ばかげていた') == [
        tuple('ば か げ て い た'.split()),
        tuple('ba ka ge te i ta'.split()),
    ]
    assert get_romaji('きゃしゃちゃじゃぢゃ') == [
        tuple('きゃ しゃ ちゃ じゃ ぢゃ'.split()),
        tuple('kya sha cha ja dya'.split()),
    ]
    assert get_romaji('クール') == [
        tuple('ク ー ル'.split()),
        tuple('ku - ru'.split()),
    ]
    assert get_romaji('けんど') == [
        tuple('け ん ど'.split()),
        tuple('ke n do'.split()),
    ]

    # TODO: fix; case where edict2 has two words and this is the second one
    # assert get_word_kana('命に係わる') == 'いのちにかかわる'