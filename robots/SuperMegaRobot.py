class SuperMegaRobot(Robot.Robot):
    
    def initialize(self):
        super().is_cannon_ready()
        super().get_position()
        
    def respond(self):
        super().is_cannon_ready()
        
        super().cannon(100, 50)
        
        super().point_scanner(0, 0)
        
        super().scanned()
        
        super().drive(0, 40)
        
        super().get_direction()
        
        super().get_velocity()
        
        super().get_position()
        
        super().get_damage()

