# 🎓 React Patterns Quick Reference

## Table of Contents
1. [State Management](#state-management)
2. [useEffect Patterns](#useeffect-patterns)
3. [Custom Hooks](#custom-hooks)
4. [Conditional Rendering](#conditional-rendering)
5. [Event Handling](#event-handling)
6. [API Calls & Error Handling](#api-calls--error-handling)
7. [Performance Tips](#performance-tips)

---

## State Management

### Basic State
```javascript
const [count, setCount] = useState(0);

// Update state
setCount(5);  // Direct value
setCount(prev => prev + 1);  // Functional update (safer)
```

### Multiple Related States
```javascript
// ❌ Bad: Separate unrelated states
const [userFirstName, setUserFirstName] = useState('');
const [userLastName, setUserLastName] = useState('');
const [userEmail, setUserEmail] = useState('');

// ✅ Good: Group related data
const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
});

// Update specific field
setUser(prev => ({ ...prev, firstName: 'John' }));
```

### Derived State
```javascript
// ❌ Bad: Storing computed values in state
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0);  // Redundant!

// ✅ Good: Compute on render
const [items, setItems] = useState([]);
const itemCount = items.length;  // Derived from items
```

---

## useEffect Patterns

### Run Once on Mount
```javascript
useEffect(() => {
    console.log('Component mounted');
    fetchData();
}, []);  // Empty dependency array
```

### Run on Dependency Change
```javascript
useEffect(() => {
    console.log('Search query changed:', searchQuery);
    filterResults();
}, [searchQuery]);  // Runs when searchQuery changes
```

### Cleanup Function
```javascript
useEffect(() => {
    const timer = setInterval(() => {
        console.log('Tick');
    }, 1000);

    // Cleanup: runs when component unmounts or before next effect
    return () => {
        clearInterval(timer);
    };
}, []);
```

### Multiple Dependencies
```javascript
useEffect(() => {
    // Runs when ANY dependency changes
    const filtered = items.filter(item => 
        item.name.includes(searchQuery) &&
        item.category === selectedCategory
    );
    setFilteredItems(filtered);
}, [items, searchQuery, selectedCategory]);
```

---

## Custom Hooks

### Basic Custom Hook
```javascript
// useLocalStorage.js
function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

### Custom Hook with Multiple Returns
```javascript
// useToast.js
function useToast() {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, showToast, removeToast };
}

// Usage
const { toasts, showToast } = useToast();
showToast('Success!', 'success');
```

---

## Conditional Rendering

### Using &&
```javascript
// Render if condition is true
{isLoggedIn && <UserProfile />}

// Multiple conditions
{isLoggedIn && hasPermission && <AdminPanel />}
```

### Using Ternary Operator
```javascript
// Simple condition
{isLoading ? <Spinner /> : <Content />}

// With null
{isLoading ? <Spinner /> : null}
```

### Multiple Conditions
```javascript
// ❌ Bad: Nested ternaries (hard to read)
{loading ? <Spinner /> : error ? <Error /> : data ? <Content /> : <Empty />}

// ✅ Good: Early returns or separate conditions
if (loading) return <Spinner />;
if (error) return <Error />;
if (!data) return <Empty />;
return <Content />;

// Or use separate conditions
{loading && <Spinner />}
{error && <Error />}
{!loading && !error && !data && <Empty />}
{!loading && !error && data && <Content />}
```

### Switch-Like Rendering
```javascript
const StatusBadge = ({ status }) => {
    const badges = {
        pending: <span className="badge-yellow">Pending</span>,
        approved: <span className="badge-green">Approved</span>,
        rejected: <span className="badge-red">Rejected</span>
    };
    
    return badges[status] || <span className="badge-gray">Unknown</span>;
};
```

---

## Event Handling

### Basic Event Handler
```javascript
const handleClick = () => {
    console.log('Button clicked');
};

<button onClick={handleClick}>Click Me</button>
```

### Event Handler with Parameters
```javascript
// ❌ Bad: Creates new function on every render
<button onClick={handleClick(id)}>Delete</button>

// ✅ Good: Use arrow function
<button onClick={() => handleClick(id)}>Delete</button>

// ✅ Better: Use data attributes (for lists)
<button onClick={handleClick} data-id={id}>Delete</button>

const handleClick = (e) => {
    const id = e.currentTarget.dataset.id;
    // Use id
};
```

### Form Handling
```javascript
// Controlled input
const [name, setName] = useState('');

<input 
    value={name}
    onChange={(e) => setName(e.target.value)}
/>

// Form submission
const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page reload
    // Handle form data
};

<form onSubmit={handleSubmit}>
    {/* inputs */}
    <button type="submit">Submit</button>
</form>
```

### Preventing Default Behavior
```javascript
const handleLinkClick = (e) => {
    e.preventDefault();  // Don't navigate
    e.stopPropagation();  // Don't bubble up
    // Custom logic
};

<a href="/page" onClick={handleLinkClick}>Link</a>
```

---

## API Calls & Error Handling

### Basic Fetch Pattern
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);  // Clear previous errors
            
            const response = await api.get('/endpoint');
            setData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);  // Always runs
        }
    };

    fetchData();
}, []);
```

### Reusable Fetch Function
```javascript
const fetchData = async () => {
    try {
        setLoading(true);
        setError(null);
        const response = await api.get('/endpoint');
        setData(response.data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

// Can be called multiple times
useEffect(() => {
    fetchData();
}, []);

// Retry button
<button onClick={fetchData}>Retry</button>
```

### Error Handling Best Practices
```javascript
try {
    const response = await api.get('/endpoint');
    setData(response.data);
} catch (err) {
    // Extract meaningful error message
    const message = 
        err.response?.data?.message ||  // API error message
        err.message ||                   // Network error
        'Something went wrong';          // Fallback
    
    setError(message);
    
    // Optional: Log to error tracking service
    console.error('API Error:', err);
}
```

### Abort Controller (Cancel Requests)
```javascript
useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
        try {
            const response = await api.get('/endpoint', {
                signal: controller.signal
            });
            setData(response.data);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
            }
        }
    };

    fetchData();

    // Cleanup: cancel request if component unmounts
    return () => controller.abort();
}, []);
```

---

## Performance Tips

### 1. Avoid Inline Functions in Render
```javascript
// ❌ Bad: Creates new function on every render
{items.map(item => (
    <Item key={item.id} onClick={() => handleClick(item.id)} />
))}

// ✅ Good: Use useCallback
const handleClick = useCallback((id) => {
    // Handle click
}, []);

{items.map(item => (
    <Item key={item.id} onClick={() => handleClick(item.id)} />
))}
```

### 2. Memoize Expensive Calculations
```javascript
import { useMemo } from 'react';

// ❌ Bad: Recalculates on every render
const expensiveValue = calculateExpensiveValue(data);

// ✅ Good: Only recalculates when data changes
const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(data);
}, [data]);
```

### 3. Use Keys Properly
```javascript
// ❌ Bad: Using index as key
{items.map((item, index) => (
    <Item key={index} {...item} />
))}

// ✅ Good: Using unique ID
{items.map(item => (
    <Item key={item.id} {...item} />
))}
```

### 4. Lazy Loading
```javascript
import { lazy, Suspense } from 'react';

// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use with Suspense
<Suspense fallback={<Loading />}>
    <HeavyComponent />
</Suspense>
```

### 5. Debounce Search Input
```javascript
import { useState, useEffect } from 'react';

const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

// Debounce: wait 500ms after user stops typing
useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
}, [searchQuery]);

// Use debouncedQuery for API calls
useEffect(() => {
    if (debouncedQuery) {
        searchAPI(debouncedQuery);
    }
}, [debouncedQuery]);
```

---

## Common Patterns Summary

### Loading State Pattern
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

if (loading) return <Skeleton />;
return <Content data={data} />;
```

### Error State Pattern
```javascript
const [error, setError] = useState(null);

if (error) {
    return (
        <div>
            <p>{error}</p>
            <button onClick={retry}>Retry</button>
        </div>
    );
}
```

### Empty State Pattern
```javascript
if (!data || data.length === 0) {
    return <EmptyState />;
}
```

### Optimistic Update Pattern
```javascript
const handleLike = async (id) => {
    // Update UI immediately
    setItems(prev => prev.map(item => 
        item.id === id 
            ? { ...item, liked: true, likes: item.likes + 1 }
            : item
    ));

    try {
        // Send to server
        await api.post(`/items/${id}/like`);
    } catch (err) {
        // Revert on error
        setItems(prev => prev.map(item => 
            item.id === id 
                ? { ...item, liked: false, likes: item.likes - 1 }
                : item
        ));
    }
};
```

---

## 🎯 Key Takeaways

1. **State**: Use `useState` for component data that changes
2. **Effects**: Use `useEffect` for side effects (API calls, subscriptions)
3. **Custom Hooks**: Extract reusable logic into custom hooks
4. **Conditional Rendering**: Use `&&`, ternary, or early returns
5. **Event Handling**: Use arrow functions for parameters
6. **Error Handling**: Always use try-catch-finally
7. **Performance**: Memoize expensive calculations, use proper keys

---

## 📚 Further Reading

- [React Docs - Hooks](https://react.dev/reference/react)
- [React Patterns](https://reactpatterns.com/)
- [JavaScript.info - Async/Await](https://javascript.info/async-await)
- [MDN - Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
