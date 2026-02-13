// ============================================================
// LobbyScene — Home screen, room creation/joining, team select
// Touch + Keyboard friendly for classroom use
// ============================================================

import Phaser from 'phaser';
import { CONFIG } from '../config.js';
import { SocketManager } from '../network/SocketManager.js';

export class LobbyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LobbyScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0a0a2e);
    const W = CONFIG.WIDTH;
    const H = CONFIG.HEIGHT;

    // ── Title ──
    this.add.text(W / 2, 60, '🧠 BattleBrains', CONFIG.FONT.TITLE).setOrigin(0.5);
    this.add.text(W / 2, 110, 'Quiz Battle Arena for Teams!', CONFIG.FONT.SMALL).setOrigin(0.5);

    // ── State ──
    this.selectedMode = 'tug-of-war';
    this.playerName = 'Player' + Math.floor(Math.random() * 999);
    this.roomInput = '';
    this.inRoom = false;

    // ── Game Mode Selection ──
    this.add.text(W / 2, 160, 'Choose Battle Mode', CONFIG.FONT.HEADING).setOrigin(0.5);

    const modes = [
      { key: 'tug-of-war',       label: '⚡ Tug-of-War',          x: W / 2 - 300 },
      { key: 'rocket-rush',      label: '🚀 Rocket Rush',         x: W / 2 },
      { key: 'catapult-clash',   label: '🏰 Catapult Clash',      x: W / 2 + 300 },
    ];

    this.modeButtons = [];
    modes.forEach(m => {
      const btn = this._createButton(m.x, 220, m.label, () => {
        this.selectedMode = m.key;
        this._updateModeButtons();
      });
      btn.modeKey = m.key;
      this.modeButtons.push(btn);
    });
    this._updateModeButtons();

    // ── Player Name ──
    this.add.text(W / 2, 300, 'Your Name:', CONFIG.FONT.BODY).setOrigin(0.5);
    this.nameText = this.add.text(W / 2, 340, this.playerName, {
      ...CONFIG.FONT.BODY, backgroundColor: '#222244', padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive();
    this.nameText.on('pointerdown', () => this._promptName());

    // ── Create Room Button ──
    this._createButton(W / 2 - 160, 420, '🏠 Create Room', () => this._createRoom());

    // ── Join Room ──
    this._createButton(W / 2 + 160, 420, '🎮 Join Room', () => this._joinRoom());

    this.add.text(W / 2, 480, 'Room Code:', CONFIG.FONT.SMALL).setOrigin(0.5);
    this.roomCodeText = this.add.text(W / 2, 510, '______', {
      ...CONFIG.FONT.BODY, backgroundColor: '#222244', padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive();
    this.roomCodeText.on('pointerdown', () => this._promptRoomCode());

    // ── Waiting Room Panel (hidden initially) ──
    this.waitingPanel = this.add.container(W / 2, H / 2 + 80).setVisible(false);
    
    this.waitingBg = this.add.rectangle(0, 0, 700, 250, 0x1a1a3e, 0.95).setStrokeStyle(2, CONFIG.COLORS.GOLD);
    this.waitingTitle = this.add.text(0, -100, 'Room: ------', CONFIG.FONT.HEADING).setOrigin(0.5);
    this.waitingTeams = this.add.text(0, -50, '', CONFIG.FONT.BODY).setOrigin(0.5);
    this.waitingStatus = this.add.text(0, 10, 'Waiting for players...', CONFIG.FONT.SMALL).setOrigin(0.5);

    const startBtn = this._createButtonRaw(0, 70, '🚀 START BATTLE!', CONFIG.COLORS.GREEN, () => {
      SocketManager.startGame();
    });
    const switchBtn = this._createButtonRaw(0, 110, '🔄 Switch Team', CONFIG.COLORS.PURPLE, () => {
      SocketManager.switchTeam();
    });

    this.waitingPanel.add([this.waitingBg, this.waitingTitle, this.waitingTeams, this.waitingStatus, startBtn, switchBtn]);

    // ── Keyboard input for room code ──
    this.input.keyboard.on('keydown', (e) => {
      if (!this.inRoom && e.key.length === 1 && /[A-Za-z0-9]/.test(e.key)) {
        this.roomInput = (this.roomInput + e.key.toUpperCase()).slice(0, 6);
        this.roomCodeText.setText(this.roomInput || '______');
      }
      if (e.key === 'Backspace') {
        this.roomInput = this.roomInput.slice(0, -1);
        this.roomCodeText.setText(this.roomInput || '______');
      }
      if (e.key === 'Enter' && this.roomInput.length >= 4) {
        this._joinRoom();
      }
    });

    // ── Socket Listeners ──
    this._setupSocketListeners();

    // ── Footer ──
    this.add.text(W / 2, H - 30, 'RED Team: Q W E R keys  |  BLUE Team: U I O P keys  |  Touch: Tap answers!',
      { ...CONFIG.FONT.SMALL, fontSize: '14px' }).setOrigin(0.5);
  }

  // ── Socket Listeners ──

  _setupSocketListeners() {
    SocketManager.on('player-joined', (data) => {
      this._updateWaitingRoom(data.teamRed, data.teamBlue);
    });

    SocketManager.on('player-left', (data) => {
      this._updateWaitingRoom(data.teamRed, data.teamBlue);
    });

    SocketManager.on('teams-updated', (data) => {
      this._updateWaitingRoom(data.teamRed, data.teamBlue);
    });

    SocketManager.on('game-started', (data) => {
      const sceneMap = {
        'tug-of-war': 'TugOfWarScene',
        'rocket-rush': 'RocketRushScene',
        'catapult-clash': 'CatapultClashScene'
      };
      this.scene.start(sceneMap[data.mode], {
        state: data.state,
        question: data.question,
        mode: data.mode
      });
    });
  }

  _updateWaitingRoom(teamRed, teamBlue) {
    const redNames = teamRed.map(p => p.name).join(', ') || '(empty)';
    const blueNames = teamBlue.map(p => p.name).join(', ') || '(empty)';
    this.waitingTeams.setText(`🔴 Red: ${redNames}\n🔵 Blue: ${blueNames}`);
    this.waitingStatus.setText(`${teamRed.length + teamBlue.length} player(s) in room`);
  }

  // ── Room Actions ──

  async _createRoom() {
    try {
      const res = await SocketManager.createRoom(this.playerName, this.selectedMode);
      this.inRoom = true;
      this.waitingPanel.setVisible(true);
      this.waitingTitle.setText(`Room: ${res.roomCode}`);
      this.waitingTeams.setText(`🔴 Red: ${this.playerName}\n🔵 Blue: (waiting...)`);
      this.roomInput = res.roomCode;
      this.roomCodeText.setText(res.roomCode);
    } catch (err) {
      console.error('Create room failed:', err);
    }
  }

  async _joinRoom() {
    if (this.roomInput.length < 4) return;
    try {
      const res = await SocketManager.joinRoom(this.roomInput, this.playerName);
      this.inRoom = true;
      this.waitingPanel.setVisible(true);
      this.waitingTitle.setText(`Room: ${res.roomCode}`);
    } catch (err) {
      console.error('Join room failed:', err);
      this.waitingStatus.setText('❌ ' + err);
    }
  }

  _promptName() {
    const name = window.prompt('Enter your name:', this.playerName);
    if (name && name.trim()) {
      this.playerName = name.trim().slice(0, 15);
      this.nameText.setText(this.playerName);
    }
  }

  _promptRoomCode() {
    const code = window.prompt('Enter room code:', this.roomInput);
    if (code && code.trim()) {
      this.roomInput = code.trim().toUpperCase().slice(0, 6);
      this.roomCodeText.setText(this.roomInput);
    }
  }

  // ── UI Helpers ──

  _createButton(x, y, label, onClick) {
    const btn = this.add.text(x, y, label, {
      ...CONFIG.FONT.BUTTON,
      fontSize: '20px',
      backgroundColor: '#6c5ce7',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#a29bfe' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: btn._selected ? '#e17055' : '#6c5ce7' }));
    btn.on('pointerdown', onClick);
    return btn;
  }

  _createButtonRaw(x, y, label, color, onClick) {
    const hex = '#' + color.toString(16).padStart(6, '0');
    const btn = this.add.text(x, y, label, {
      ...CONFIG.FONT.BUTTON,
      fontSize: '18px',
      backgroundColor: hex,
      padding: { x: 14, y: 6 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', onClick);
    return btn;
  }

  _updateModeButtons() {
    this.modeButtons.forEach(btn => {
      const selected = btn.modeKey === this.selectedMode;
      btn._selected = selected;
      btn.setStyle({ backgroundColor: selected ? '#e17055' : '#6c5ce7' });
    });
  }
}
