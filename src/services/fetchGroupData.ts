const TOONHQ_URL = 'https://toonhq.org/api/groups/list/1/'

export async function fetchGroupData() {
    try {
        const response = await fetch(TOONHQ_URL)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        
        return data
    } catch (error) {
        console.error("failed to fetch group data: ", error)
    }
}