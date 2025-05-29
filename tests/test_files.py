import pytest


def test_readme_ends_with_newline():
    with open('README.md', 'rb') as f:
        content = f.read()
    assert content.endswith(b"\n"), "README.md should end with a newline"


def test_license_has_no_placeholder():
    with open('LICENSE', 'r', encoding='utf-8') as f:
        text = f.read()
    assert '[yyyy]' not in text, "LICENSE should not contain the '[yyyy]' placeholder"

