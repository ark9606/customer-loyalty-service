import { app } from './app';
import { ConfigService } from './config/config-service';


app.listen(ConfigService.port, () => {
  console.log(`Customer loyalty service is running at http://localhost:${ConfigService.port}`);
});
