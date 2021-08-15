import os
import main
import unittest


class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        main.app.testing = True
        self.app = main.app.test_client()

    def tearDown(self):
        pass

    def test_main_page(self):
        rv = self.app.get('/')
        assert b'music' in rv.data

    def test_get_music(self):
        rv = self.app.post('/api/get_music', content_type='json',
                           data=b"{'array':[]}")
        response = eval(rv.data)
        print(response)
        assert response['url'][0:7] == './songs'


if __name__ == '__main__':
    unittest.main()
