// Orientation and fullscreen handler for mobile devices
class OrientationHandler {
    constructor(containerId = 'game-container') {
        this.container = document.getElementById(containerId);
        this.isFullscreen = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for orientation changes
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => this.handleOrientationChange());
        } else {
            window.addEventListener('orientationchange', () => this.handleOrientationChange());
        }

        // Fallback resize listener
        window.addEventListener('resize', () => this.handleResize());

        // Handle fullscreen changes
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());

        // Initial check
        this.checkOrientation();
    }

    async handleOrientationChange() {
        // Small delay to allow orientation change to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        this.checkOrientation();
    }

    handleResize() {
        // Use resize as a fallback for orientation detection
        this.checkOrientation();
    }

    async checkOrientation() {
        const isLandscape = this.isLandscapeMode();
        
        if (isLandscape && !this.isFullscreen) {
            await this.enterFullscreen();
        } else if (!isLandscape && this.isFullscreen) {
            this.exitFullscreen();
        }
    }

    isLandscapeMode() {
        if (screen.orientation) {
            return screen.orientation.type.includes('landscape');
        } else if (window.orientation !== undefined) {
            return Math.abs(window.orientation) === 90;
        }
        // Fallback to window dimensions
        return window.innerWidth > window.innerHeight;
    }

    async enterFullscreen() {
        if (!document.fullscreenElement) {
            try {
                const element = this.container || document.documentElement;
                if (element.requestFullscreen) {
                    await element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    await element.webkitRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    await element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    await element.msRequestFullscreen();
                }
                this.isFullscreen = true;
            } catch (error) {
                console.warn('Fullscreen request failed:', error);
            }
        }
    }

    exitFullscreen() {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        this.isFullscreen = false;
    }

    handleFullscreenChange() {
        this.isFullscreen = !!document.fullscreenElement;
        // Dispatch custom event for game to handle
        const event = new CustomEvent('fullscreenchange', {
            detail: { isFullscreen: this.isFullscreen }
        });
        window.dispatchEvent(event);
    }
}

// Export the handler
export default OrientationHandler; 