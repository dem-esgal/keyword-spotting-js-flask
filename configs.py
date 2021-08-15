import os


def is_windows():
    return os.name == 'nt'

def server_config_path():
    if is_windows():
        return './server.cfg'
    else:
        return '/etc/flask/server.cfg'
