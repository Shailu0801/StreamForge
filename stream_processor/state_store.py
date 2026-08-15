from pathlib import Path

from rocksdict import Rdict


BASE_STATE_DIRECTORY = Path("streamforge_state")


class StateStore:

    def __init__(self, worker_id="worker1"):

        self.worker_id = worker_id

        self.state_directory = (
            BASE_STATE_DIRECTORY / worker_id
        )

        self.state_directory.mkdir(
            parents=True,
            exist_ok=True
        )

        self.db = Rdict(
            str(self.state_directory)
        )

    def get_window_state(self, key):

        return self.db.get(key)

    def save_window_state(self, key, state):

        self.db[key] = state

    def delete_window_state(self, key):

        if key in self.db:
            del self.db[key]

    def get_all_window_states(self):

        states = {}

        for key in self.db.keys():

            value = self.db.get(key)

            states[key] = value

        return states

    def close(self):

        self.db.close()