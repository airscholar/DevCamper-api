Set token as environmental variable based on login response

```
pm.environment.set('TOKEN', pm.response.json().token)
```