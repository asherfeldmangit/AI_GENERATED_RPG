from __future__ import annotations

"""Graphical frontend using Pygame for the ASCII-Quest engine.

Controls
--------
Story phase:  press number 1-9 to choose an option.
Battle phase: 1 Strike-All, 2 Magic-All, 3 Defend-All, 4 Heal-All
Skill phase:  Space to roll.
Esc / window close exits game.
"""

import sys
import textwrap
import pygame
from pygame import Surface

from .engine import GameEngine
from .party import Party
from .player import Player
from .data_enemies import ENEMIES

WIDTH, HEIGHT = 900, 700
FONT_SIZE = 18
LINES_ON_SCREEN = 32
LOG_COLOR = (0, 220, 0)
PROMPT_COLOR = (255, 255, 0)
BG = (0, 0, 0)


class Frontend:
    def __init__(self) -> None:
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("ASCII Quest – Pygame Edition")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont("Courier New", FONT_SIZE)

        party = Party([Player("Hero")])
        self.engine = GameEngine(party)

    # ------------ utility ------------
    def blit_text(self, text: str, y: int, color) -> int:
        for line in text.split("\n"):
            surf: Surface = self.font.render(line, True, color)
            self.screen.blit(surf, (10, y))
            y += FONT_SIZE + 2
        return y

    def render(self) -> None:
        self.screen.fill(BG)

        # draw latest log lines
        log_lines = self.engine.log[-LINES_ON_SCREEN:]
        y = 10
        for line in log_lines:
            # wrap long lines
            wrapped = textwrap.wrap(line, width=90)
            for w in wrapped:
                y = self.blit_text(w, y, LOG_COLOR)
        # draw prompt based on phase
        y += 10
        if self.engine.phase == "story":
            scene = self.engine.current_scene()
            for idx, opt in enumerate(scene["options"], 1):
                y = self.blit_text(f"[{idx}] {opt['label']}", y, PROMPT_COLOR)
        elif self.engine.phase == "battle":
            y = self.blit_text("Battle commands:", y, PROMPT_COLOR)
            y = self.blit_text("[1] Strike All  [2] Magic All  [3] Defend All  [4] Heal All", y, PROMPT_COLOR)
        elif self.engine.phase == "skill":
            y = self.blit_text("Press SPACE to attempt the skill challenge", y, PROMPT_COLOR)
        elif self.engine.phase == "end":
            y = self.blit_text("GAME OVER – Press Esc", y, PROMPT_COLOR)
        pygame.display.flip()

    # ------------ input handling ------------
    def handle_key(self, key: int) -> None:
        if self.engine.phase == "story":
            if pygame.K_1 <= key <= pygame.K_9:
                self.engine.choose_option(key - pygame.K_1)
        elif self.engine.phase == "battle":
            if key in (pygame.K_1, pygame.K_2, pygame.K_3, pygame.K_4):
                action_map = {
                    pygame.K_1: "strike",
                    pygame.K_2: "magic",
                    pygame.K_3: "defend",
                    pygame.K_4: "heal",
                }
                action = action_map[key]
                acts = [action] * len(self.engine.party.members)
                self.engine.perform_battle_round(acts)
        elif self.engine.phase == "skill":
            if key == pygame.K_SPACE:
                self.engine.perform_skill_check(0)
        elif self.engine.phase == "end":
            if key == pygame.K_ESCAPE:
                pygame.event.post(pygame.event.Event(pygame.QUIT))

    # ------------ main loop ------------
    def run(self) -> None:
        running = True
        while running:
            for ev in pygame.event.get():
                if ev.type == pygame.QUIT:
                    running = False
                elif ev.type == pygame.KEYDOWN:
                    self.handle_key(ev.key)
            self.render()
            self.clock.tick(30)
        pygame.quit()
        sys.exit()


def run() -> None:
    Frontend().run()


if __name__ == "__main__":
    run() 