Running the code should be pretty straightforward. 

Start the server by running `npm run dev` in `server`.

Start the frontend by running `npm run dev` in `frontend`.

You can run the test suites using `npm run test` in `server`.

I opted to use jest for testing, mocking the Repository and Service layers to test them in isolation.

I thought about creating a Controller layer between Service and Repository, but ultimately decided that for this project, the business logic was simple enough that separating Services from Controllers seemed like overkill.

I opted to use shared model classes to create a strong interface between the frontend and backend, since it's all in TypeScript. I was really glad that I separated responsbilities between repositories and services, because it made it really easy to modify certain pieces when I realized something needed to change, without having to refactor all the depenedencies. It was a great, practical example of the importance of decoupling. You can see some examples of how easy those refactors were when they came up.

You'll notice that there are some gaps between commit times. I did this mostly in one sitting, but I did have to take a few breaks to run some errands. The total time I actually spent time coding was roughly four hours. 

I had a lot of fun with this! It was cool to actually code up a whole little mini server and frontend client as a technical assessment. 

A couple assumptions I made:
- The relationship between Organizations and Accounts is one to many (one Organization has many Accounts, but one Account has exactly one Organization)
- The relationship between Accounts and Deals is one to many (one Account can have many Deals, but each Deal has only one account)

If the relationship were many to many, I would have created join tables rather than using foreign keys on the Accounts and Deals tables. I also assumed that the Deals should be named, which made it a little more fun with the Matrix theme I went with for the dummy data. 

If I had more time, I'd really like to refine the filtering logic. The "value" filter really ought to allow filtering by all the standard comparison operators (less then, less then or equal to, greater than, greater than or equal to, and equal to). Same thing with the years. Might be nice to have the ability to select a year range, actually. 

In any case, I had a lot of fun with this, like I said, and I could keep iterating on it for a while yet. But it's time to turn it in! Looking forward to hearing back.
