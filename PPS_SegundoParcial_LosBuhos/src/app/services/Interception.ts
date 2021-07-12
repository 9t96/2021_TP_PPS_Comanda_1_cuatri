import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";


export class Interception {
    intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `key=AAAAdeyUGBo:APA91bHFfb_9snCtK-5Q8OOEDkyLn5bXwAaZ2aFQxEgFwzcLZrCdHv7UWPIOi16srCiV_KM3-L0EgjDsZvJ5dvp2CxVr9biqqv1xvMXn2vzK4eC6Vlw3Ei77m6mZgKQ3B0i8KZ3-1Vwj`,
        },
      });
      return next.handle(req);
    }
  }