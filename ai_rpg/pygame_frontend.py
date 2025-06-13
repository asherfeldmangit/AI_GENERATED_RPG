from __future__ import annotations

import pygame
from pygame import Surface

from .game import build_enemies, get_player_action  # reuse helpers for data
from .party import Party
from .player import Player
from .party_battle import PartyBattle
from .story import story_event, skill_check_event

WIDTH, HEIGHT = 800, 600
FONT_SIZE = 18


class PygameUI:
    def __init__(self) -> None:
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("ASCII Quest")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont("Courier New", FONT_SIZE)
        self.lines: list[str] = []

    def draw(self) -> None:
        self.screen.fill((0, 0, 0))
        y = 10
        for line in self.lines[-28:]:
            surf: Surface = self.font.render(line, True, (0, 255, 0))
            self.screen.blit(surf, (10, y))
            y += FONT_SIZE + 2
        pygame.display.flip()

    def add_log(self, text: str) -> None:
        for sub in text.split("\n"):
            self.lines.append(sub)

    def main(self) -> None:
        rng = __import__("random").Random()
        party = Party([Player("Hero", rng=rng)])
        enemies = build_enemies(rng)
        for enemy in enemies:
            self.add_log(f"A wild {enemy.name} appears!")
            battle = PartyBattle(party, enemy, rng=rng)
            while party.alive and enemy.alive:
                for ev in pygame.event.get():
                    if ev.type == pygame.QUIT:
                        pygame.quit()
                        return
                    if ev.type == pygame.KEYDOWN:
                        if ev.key == pygame.K_a:
                            self.add_log(battle.player_turn("s"))
                            self.add_log(battle.enemy_turn())
                        elif ev.key == pygame.K_h:
                            self.add_log(battle.player_turn("h"))
                            self.add_log(battle.enemy_turn())
                self.clock.tick(30)
                self.draw()
            self.draw()
            if not party.alive:
                self.add_log("You have been defeated...")
                break
            self.add_log("Enemy defeated! Press any key to continue...")
            self.wait_key()
            story_event(party.members[0], rng)
            skill_check_event(party)
        self.add_log("Game Over! Press any key to exit.")
        self.draw()
        self.wait_key()
        pygame.quit()

    def wait_key(self) -> None:
        waiting = True
        while waiting:
            for ev in pygame.event.get():
                if ev.type == pygame.KEYDOWN or ev.type == pygame.QUIT:
                    waiting = False
            self.clock.tick(30)
            self.draw()


def run() -> None:
    PygameUI().main()


if __name__ == "__main__":
    run() 